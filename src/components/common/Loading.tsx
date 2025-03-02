export default function LoadingSpinner({className}: {className?: string}) {
    return (
      <div className="flex mt-2">
        <div className={`${className ? className : "w-6 h-6"} border-4 border-gray-300 border-t-gray-600 rounded-full animate-spin`}></div>
      </div>
    );
  }
  