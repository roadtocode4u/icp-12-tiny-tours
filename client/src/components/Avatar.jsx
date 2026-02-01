function Avatar({ name, size = "medium" }) {
  const SIZE_CLASSES = {
    small: "h-6 w-6 text-xs",
    medium: "h-8 w-8 text-sm",
    large: "h-12 w-12 text-lg",
  };

  return (
    <span
      className={`bg-black text-white flex items-center justify-center ${SIZE_CLASSES[size]} rounded-full mr-2 `}
    >
      {name[0]}
    </span>
  );
}

export default Avatar;
