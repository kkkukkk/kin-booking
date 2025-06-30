'use client'

import DatePicker from "@/components/calendar/DatePicker";
import { useEffect, useState, useRef } from "react";
import { useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import Input from "@/components/base/Input";
import Button from "@/components/base/Button";
import { AnimatePresence, motion } from "framer-motion";
import { fadeSlideDownSm } from "@/types/ui/motionVariants";
import dayjs from "dayjs";
import clsx from "clsx";
import styles from "@/css/module/search-bar.module.css";
import Select from "@/components/base/Select";
import useDebounce from "@/hooks/useDebounce";
import { FilterIcon } from "@/components/icon/FilterIcon";
import { createPortal } from "react-dom";

interface SearchBarProps {
  label?: string;
  icon?: React.ReactNode;
  filters: {
    keyword?: {
      value: string;
      onChange: (value: string) => void;
      placeholder?: string;
    };
    dateRange?: {
      from: string;
      to: string;
      onChange: (from: string, to: string) => void;
    };
    status?: {
      value: string;
      onChange: (value: string) => void;
      options: { value: string; label: string }[];
    };
  };
}

const SearchBar = ({
  label = "검색 및 필터",
  icon = <FilterIcon />,
  filters,
}: SearchBarProps) => {
  const theme = useAppSelector((state: RootState) => state.theme.current);

  const [tempFrom, setTempFrom] = useState(filters.dateRange?.from ?? '');
  const [tempTo, setTempTo] = useState(filters.dateRange?.to ?? '');
  const [keyword, setKeyword] = useState(filters.keyword?.value ?? '');
  const [isOpen, setIsOpen] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const datePickerRef = useRef<HTMLButtonElement>(null);
  const [datePickerPosition, setDatePickerPosition] = useState({ top: 0, left: 0, width: 0 });

  const debouncedKeyword = useDebounce(keyword, 300);

  useEffect(() => {
    if (filters.keyword && debouncedKeyword !== filters.keyword.value) {
      setKeyword(debouncedKeyword);
      filters.keyword.onChange(debouncedKeyword);
    }
  }, [debouncedKeyword, filters.keyword]);

  const handleReset = () => {
    setTempFrom('');
    setTempTo('');
    setKeyword('');
    if (filters.dateRange) filters.dateRange.onChange('', '');
    if (filters.keyword) filters.keyword.onChange('');
    if (filters.status) filters.status.onChange('');
  };

  useEffect(() => {
    setTempFrom(filters.dateRange?.from ?? '');
    setTempTo(filters.dateRange?.to ?? '');
  }, [filters.dateRange?.from, filters.dateRange?.to]);

  const handleDatePickerToggle = () => {
    if (datePickerRef.current) {
      const rect = datePickerRef.current.getBoundingClientRect();
      setDatePickerPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }
    setShowDatePicker(!showDatePicker);
  };

  return (
    <>
      <div className="rounded text-sm flex flex-col">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {icon}
            <span className="font-medium">{label}</span>
          </div>
          <Button
            theme="dark"
            width="w-24"
            padding="py-1 md:py-0.5"
            reverse={theme === "normal"}
            className="self-end"
            onClick={() => {
              setIsOpen(prev => !prev);
              setShowDatePicker(false);
            }}
          >
            {isOpen ? "닫기" : "열기"}
          </Button>
        </div>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              key="search-form"
              layout
              initial={{ opacity: 0, height: 0, overflow: 'hidden' }}
              animate={{
                opacity: 1,
                height: 'auto',
                overflow: 'visible',
                transition: {
                  height: { duration: 0.2 },
                  opacity: { duration: 0.3, delay: 0.2 },
                },
              }}
              exit={{
                opacity: 0,
                height: 0,
                overflow: 'hidden',
                transition: {
                  opacity: { duration: 0.2 },
                  height: { duration: 0.3, delay: 0.2 },
                },
              }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="flex flex-col md:flex-row gap-2 items-center w-full mt-2"
            >
              {filters.keyword && (
                <Input
                  theme={theme}
                  name="keyword"
                  value={keyword}
                  onChange={e => {
                    setKeyword(e.target.value);
                    filters.keyword?.onChange(e.target.value);
                  }}
                  placeholder={filters.keyword.placeholder ?? '검색어 입력'}
                  className="px-2 py-1 rounded w-full md:w-1/2"
                />
              )}

              {filters.status && (
                <Select
                  value={filters.status.value}
                  onChange={filters.status.onChange}
                  options={filters.status.options}
                  placeholder="선택"
                  className="w-full md:w-1/6"
                />
              )}

              {filters.dateRange && (
                <div className="relative w-full md:min-w-[300px] md:w-1/4">
                  <button
                    ref={datePickerRef}
                    type="button"
                    onClick={handleDatePickerToggle}
                    className={clsx(
                      styles["date-picker-label"],
                      styles[theme],
                      "px-2 py-1 rounded w-full text-left cursor-pointer"
                    )}
                  >
                    {tempFrom && tempTo ? `${tempFrom} ~ ${tempTo}` : '기간'}
                  </button>
                </div>
              )}

              <div className="flex gap-2 w-full md:w-1/8">
                <Button
                  width="w-full"
                  padding="py-1 md:py-0.5"
                  theme="dark"
                  onClick={handleReset}
                  reverse={theme === "normal"}
                  className="self-end"
                >
                  리셋
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Portal for DatePicker */}
      {showDatePicker && typeof window !== 'undefined' && createPortal(
        <motion.div
          variants={fadeSlideDownSm}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.3 }}
          className="fixed z-[9999] text-sm"
          style={{
            top: datePickerPosition.top,
            left: datePickerPosition.left,
            width: datePickerPosition.width,
          }}
        >
          <DatePicker
            initialFrom={tempFrom ? dayjs(tempFrom) : undefined}
            initialTo={tempTo ? dayjs(tempTo) : undefined}
            onChange={(from, to) => {
              const f = from.format('YYYY-MM-DD');
              const t = to.format('YYYY-MM-DD');
              setTempFrom(f);
              setTempTo(t);
              filters.dateRange!.onChange(f, t);
              setShowDatePicker(false);
            }}
          />
        </motion.div>,
        document.body
      )}
    </>
  );
};

export default SearchBar;