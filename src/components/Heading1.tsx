type Heading1Props = {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
};

export default function Button({ children, onClick }: Heading1Props) {
  return (
    <h1
      onClick={onClick}
       className="tangerine text-5xl md:text-7xl text-center"
    >
      {children}
    </h1>
  );
}
