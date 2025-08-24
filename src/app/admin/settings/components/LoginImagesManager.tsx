'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { 
  fetchImagesByType, 
  createImage, 
  updateImage, 
  deleteImage,
  updateImageOrder 
} from '@/api/appImages';
import { AppImage } from '@/types/model/appImages';
import { CreateAppImageDto } from '@/types/dto/appImages';
import Button from '@/components/base/Button';
import Input from '@/components/base/Input';
import useToast from '@/hooks/useToast';
import useImageUpload from '@/hooks/useImageUpload';
import ThemeDiv from '@/components/base/ThemeDiv';
import { useAppSelector } from '@/redux/hooks';
import { RootState } from '@/redux/store';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import Spinner from '@/components/spinner/Spinner';

export default function LoginImagesManager() {
  const theme = useAppSelector((state: RootState) => state.theme.current);
  const [images, setImages] = useState<AppImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<CreateAppImageDto>({
    type: 'login_slide',
    url: '',
    order: 0,
    isActive: true
  });
  
  // 타입 안전성을 위한 setter 함수
  const updateEditForm = (updates: Partial<CreateAppImageDto>) => {
    setEditForm(prev => ({ ...prev, ...updates }));
  };
  const { showToast } = useToast();
  const { uploading, uploadProgress, uploadImage } = useImageUpload({
    onSuccess: (url) => {
      // 업로드 성공 시 URL을 폼에 설정
      setEditForm(prev => ({ ...prev, url }));
    }
  });

  const loadImages = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchImagesByType('login_slide');
      setImages(data);
    } catch (error) {
      console.error('로그인 이미지 로드 실패:', error);
      showToast({ message: '이미지를 불러오는데 실패했습니다.', iconType: 'error', autoCloseTime: 3000 });
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    loadImages();
  }, [loadImages]);

  const handleEdit = (image: AppImage) => {
    setEditingId(image.id);
    setEditForm({
      type: 'login_slide',
      url: image.url,
      order: image.order,
      isActive: image.isActive
    });
  };

  const handleSave = async () => {
    try {
      if (editingId && editingId !== 'new') {
        await updateImage(editingId, {
          url: editForm.url,
          order: editForm.order,
          isActive: editForm.isActive
        });
        showToast({ message: '이미지가 업데이트되었습니다.', iconType: 'success', autoCloseTime: 3000 });
      } else {
        await createImage(editForm);
        showToast({ message: '새 이미지가 추가되었습니다.', iconType: 'success', autoCloseTime: 3000 });
      }
      
      setEditingId(null);
      setEditForm({ type: 'login_slide', url: '', order: 0, isActive: true });
      await loadImages();
    } catch (error) {
      console.error('이미지 저장 실패:', error);
      showToast({ message: '이미지 저장에 실패했습니다.', iconType: 'error', autoCloseTime: 3000 });
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditForm({ type: 'login_slide', url: '', order: 0, isActive: true });
  };



  // 파일 선택 핸들러
  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      await uploadImage(file, 'login_slide');
    } catch (error) {
      console.error('파일 업로드 실패:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('정말로 이 이미지를 삭제하시겠습니까?')) {
      try {
        await deleteImage(id);
        showToast({ message: '이미지가 삭제되었습니다.', iconType: 'success', autoCloseTime: 3000 });
        await loadImages();
      } catch (error) {
        console.error('이미지 삭제 실패:', error);
        showToast({ message: '이미지 삭제에 실패했습니다.', iconType: 'error', autoCloseTime: 3000 });
      }
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (active.id !== over?.id) {
      const oldIndex = images.findIndex(img => img.id === active.id);
      const newIndex = images.findIndex(img => img.id === over?.id);
      
      const newImages = arrayMove(images, oldIndex, newIndex);
      setImages(newImages);
      
      // 순서 업데이트
      const updates = newImages.map((img, index) => ({
        id: img.id,
        order: index
      }));
      
      updateImageOrder(updates).catch(error => {
        console.error('순서 업데이트 실패:', error);
        showToast({ message: '순서 업데이트에 실패했습니다.', iconType: 'error', autoCloseTime: 3000 });
      });
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spinner size={64} color="var(--neon-green)" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
             <div className="flex items-center justify-between">
         <h2 className="text-2xl font-bold text-[var(--neon-green)]">로그인 슬라이드 이미지 관리</h2>
                   <Button
            onClick={() => setEditingId('new')}
            theme={theme}
            className="font-semibold px-4 py-2"
          >
            새 이미지 추가
          </Button>
       </div>

             {/* 새 이미지 추가 폼 */}
       {editingId === 'new' && (
         <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
         >
           <ThemeDiv className="rounded-lg p-6">
             <h3 className="text-lg font-semibold text-[var(--neon-green)] mb-4">새 이미지 추가</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                이미지 업로드
              </label>
              <div className="space-y-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="image-upload"
                  disabled={uploading}
                />
                <label
                  htmlFor="image-upload"
                  className={`block w-full p-3 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors ${
                    uploading 
                      ? 'border-gray-600 text-gray-500 cursor-not-allowed' 
                      : 'border-gray-500 text-gray-400 hover:border-[var(--neon-green)] hover:text-[var(--neon-green)]'
                  }`}
                >
                  {uploading ? (
                    <div className="space-y-2">
                      <Spinner size={24} color="var(--neon-green)" />
                      <div className="text-sm">업로드 중...</div>
                      {uploadProgress > 0 && (
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-[var(--neon-green)] h-2 rounded-full transition-all duration-300"
                            style={{ width: `${uploadProgress}%` }}
                          />
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="text-lg">📁</div>
                      <div className="text-sm">클릭하여 이미지 선택</div>
                      <div className="text-xs text-gray-500">또는 이미지 파일을 여기에 드래그</div>
                    </div>
                  )}
                </label>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                이미지 URL
              </label>
              <Input
                value={editForm.url}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateEditForm({ url: e.target.value })}
                theme={theme}
                className="w-full"
                placeholder="이미지 URL을 입력하거나 파일을 업로드하세요"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                순서
              </label>
              <Input
                type="number"
                value={editForm.order}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateEditForm({ order: parseInt(e.target.value) || 0 })}
                theme={theme}
                className="w-full"
                placeholder="0"
              />
            </div>
            <div className="flex items-center space-x-3">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={editForm.isActive ?? true}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateEditForm({ isActive: e.target.checked })}
                  className="mr-2"
                />
                <span className="text-sm text-gray-300">활성화</span>
              </label>
            </div>
          </div>
          <div className="flex justify-end space-x-3 mt-4">
            <Button
              onClick={handleCancel}
              theme={theme}
              reverse={theme === "normal"}
              className="px-4 py-2"
            >
              취소
            </Button>
            <Button
              onClick={handleSave}
              theme={theme}
              className="font-semibold px-4 py-2"
            >
              저장
            </Button>
          </div>
          </ThemeDiv>
        </motion.div>
      )}

      {/* 이미지 목록 */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={images.map(img => img.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-4">
            {images.map((image) => (
              <SortableImageItem
                key={image.id}
                image={image}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onSave={handleSave}
                editForm={editForm}
                updateEditForm={updateEditForm}
                editingId={editingId}
                setEditingId={setEditingId}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}

interface SortableImageItemProps {
  image: AppImage;
  onEdit: (image: AppImage) => void;
  onDelete: (id: string) => void;
  onSave: () => Promise<void>;
  editForm: CreateAppImageDto;
  updateEditForm: (updates: Partial<CreateAppImageDto>) => void;
  editingId: string | null;
  setEditingId: (id: string | null) => void;
}

function SortableImageItem({
  image,
  onEdit,
  onDelete,
  onSave,
  editForm,
  updateEditForm,
  editingId,
  setEditingId
}: SortableImageItemProps) {
  const theme = useAppSelector((state: RootState) => state.theme.current);
  const { uploading, uploadProgress, uploadImage } = useImageUpload({
    onSuccess: (url) => {
      // 업로드 성공 시 URL을 폼에 설정
      updateEditForm({ url });
    }
  });



  // 파일 선택 핸들러 (SortableImageItem용)
  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      await uploadImage(file, 'login_slide');
    } catch (error) {
      console.error('파일 업로드 실패:', error);
    }
  };
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: image.id.toString() });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const isEditing = editingId === image.id;

  if (isEditing) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <ThemeDiv className="rounded-lg p-6">
          <h3 className="text-lg font-semibold text-[var(--neon-green)] mb-4">이미지 수정</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              이미지 업로드
            </label>
            <div className="space-y-2">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
                id={`image-upload-${image.id}`}
                disabled={uploading}
              />
              <label
                htmlFor={`image-upload-${image.id}`}
                className={`block w-full p-3 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors ${
                  uploading 
                    ? 'border-gray-600 text-gray-500 cursor-not-allowed' 
                    : 'border-gray-500 text-gray-400 hover:border-[var(--neon-green)] hover:text-[var(--neon-green)]'
                }`}
              >
                {uploading ? (
                  <div className="space-y-2">
                    <Spinner size={24} color="var(--neon-green)" />
                    <div className="text-sm">업로드 중...</div>
                    {uploadProgress > 0 && (
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-[var(--neon-green)] h-2 rounded-full transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="text-lg">📁</div>
                    <div className="text-sm">클릭하여 이미지 선택</div>
                    <div className="text-xs text-gray-500">또는 이미지 파일을 여기에 드래그</div>
                  </div>
                )}
              </label>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              이미지 URL
            </label>
            <Input
              value={editForm.url}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateEditForm({ url: e.target.value })}
              theme={theme}
              className="w-full"
              placeholder="이미지 URL을 입력하거나 파일을 업로드하세요"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              순서
            </label>
            <Input
              type="number"
              value={editForm.order}
                             onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateEditForm({ order: parseInt(e.target.value) || 0 })}
              theme={theme}
              className="w-full"
              placeholder="0"
            />
          </div>
          <div className="flex items-center space-x-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={editForm.isActive ?? true}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateEditForm({ isActive: e.target.checked })}
                className="mr-2"
              />
              <span className="text-sm text-gray-300">활성화</span>
            </label>
          </div>
        </div>
        <div className="flex justify-end space-x-3 mt-4">
          <Button
            onClick={() => setEditingId(null)}
            theme={theme}
            reverse={theme === "normal"}
            className="px-4 py-2"
          >
            취소
          </Button>
          <Button
            onClick={onSave}
            theme={theme}
            className="font-semibold px-4 py-2"
          >
            저장
          </Button>
        </div>
        </ThemeDiv>
      </motion.div>
    );
  }

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
    >
      <ThemeDiv className={`rounded-lg p-4 ${
        isDragging ? 'opacity-50' : ''
      }`}>
      <div className="flex items-center space-x-4">
        <div
          {...attributes}
          {...listeners}
          className="cursor-move text-gray-400 hover:text-white p-2"
        >
          ⋮⋮
        </div>
        
        <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
          <div className="md:col-span-2">
            <div className="relative w-full h-20">
              <Image
                src={image.url}
                alt={`slide-${image.order}`}
                fill
                className="object-cover rounded"
                onError={() => {
                  console.log('이미지 로드 실패:', image.url);
                }}
              />
            </div>
          </div>
          <div className="text-sm text-gray-300">
            <div>순서: {image.order}</div>
            <div>상태: {image.isActive ? '활성' : '비활성'}</div>
          </div>
          <div className="text-sm text-gray-400 truncate">
            {image.url}
          </div>
        </div>
        
        <div className="flex space-x-2">
          <Button
            onClick={() => onEdit(image)}
            theme={theme}
            className="px-3 py-1 text-sm"
          >
            수정
          </Button>
          <Button
            onClick={() => onDelete(image.id)}
            theme={theme}
            reverse={theme === "normal"}
            className="px-3 py-1 text-sm"
          >
            삭제
          </Button>
        </div>
      </div>
      </ThemeDiv>
    </motion.div>
  );
} 