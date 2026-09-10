type ToastProps = {
  message: string;
};

const Toast = ({ message }: ToastProps) => (
  <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow">
    {message}
  </div>
);

export default Toast;
