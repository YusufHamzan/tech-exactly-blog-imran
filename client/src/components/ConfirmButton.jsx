export function ConfirmButton({ onConfirm, message = 'Are you sure?', children, className = 'danger', ...rest }) {
    return (
      <button
        type="button"
        className={className}
        onClick={() => {
          if (window.confirm(message)) onConfirm();
        }}
        {...rest}
      >
        {children}
      </button>
    );
  }