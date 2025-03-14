

function Modal({ isOpen, onClose, children }) {
    return (
      <div
        className={`text-black fixed inset-0 z-50 flex items-center justify-center transition-opacity ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
        style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
      >
        {/* Modal content */}
        <div className="bg-white rounded-sm shadow-lg w-full max-w-3xl relative">
          <button
            className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
            onClick={onClose}
          >
            &times;
          </button>
          {children}
        </div>
      </div>
    );
  }

  export default Modal;