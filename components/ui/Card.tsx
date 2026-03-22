interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
}

const paddingClasses = {
  none: "",
  sm:   "p-3",
  md:   "p-4",
  lg:   "p-5 md:p-6",
};

export function Card({
  hover = false,
  padding = "md",
  className = "",
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={[
        "rounded-2xl bg-white shadow-sm ring-1 ring-stone-100",
        paddingClasses[padding],
        hover
          ? "cursor-pointer transition-all duration-150 hover:shadow-md hover:ring-stone-200 active:scale-[0.99]"
          : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {children}
    </div>
  );
}

export default Card;
