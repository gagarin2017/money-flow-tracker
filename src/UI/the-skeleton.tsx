import { Skeleton, Space } from "antd";

interface TheSkeletonProps {
  width: number;
}

function TheSkeleton({ width }: TheSkeletonProps) {
  return (
    <Space direction="vertical" size={"large"} style={{ marginLeft: 10 }}>
      {Array.from({ length: 5 }, (_, index) => (
        <Skeleton.Avatar
          key={index}
          active
          shape="square"
          style={{ height: 20, width }}
        />
      ))}
    </Space>
  );
}

export default TheSkeleton;
