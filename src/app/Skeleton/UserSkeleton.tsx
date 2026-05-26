const UserSkeleton = ({ className }: { className?: string }) => {
  return (
    <div className={`animate-pulse bg-stone-100 rounded-lg ${className}`} />
  );
}

export default UserSkeleton