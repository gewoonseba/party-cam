type CountdownTimerProps = {
  duration: number; // Total duration in ms
  elapsed: number; // Elapsed time in ms
  size?: number; // Size in pixels
};

export function CountdownTimer({
  duration,
  elapsed,
  size = 24,
}: CountdownTimerProps) {
  const progress = Math.min(1, elapsed / duration);

  // SVG parameters
  const radius = size / 2;
  const strokeWidth = 2;
  const normalizedRadius = radius - strokeWidth;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          stroke="#4a4a4a"
          fill="transparent"
          strokeWidth={strokeWidth}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        {/* Progress circle */}
        <circle
          stroke="#00ff95"
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference + " " + circumference}
          style={{ strokeDashoffset }}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center text-xs">
        {Math.ceil((duration - elapsed) / 1000)}s
      </div>
    </div>
  );
}
