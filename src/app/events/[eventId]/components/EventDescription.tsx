interface EventDescriptionProps {
  description: string;
}

const EventDescription = ({ description }: EventDescriptionProps) => {
  return (
    <div
      className="whitespace-pre-line text-sm md:text-base leading-relaxed overflow-hidden scrollbar-hide"
      style={{ wordBreak: "break-all" }}
    >
      {description}
    </div>
  );
};

export default EventDescription; 