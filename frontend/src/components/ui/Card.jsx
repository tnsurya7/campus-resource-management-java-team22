const Card = ({ children, className = '', hover = false }) => {
  return (
    <div 
      className={`bg-white rounded-xl border border-slate-200 shadow-sm ${
        hover ? 'hover:shadow-md transition-shadow duration-200' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
};

export default Card;
