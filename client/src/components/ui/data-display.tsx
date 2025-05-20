interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  color: string;
}

export function StatCard({ icon, title, value, color }: StatCardProps) {
  return (
    <div className="text-center">
      <div className={`${color} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4`}>
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{value}</p>
    </div>
  );
}

interface AgentCardProps {
  name: string;
  specialization: string;
  rating: number;
  propertiesSold: number;
  imageUrl: string;
  onContact?: () => void;
}

export function AgentCard({ name, specialization, rating, propertiesSold, imageUrl, onContact }: AgentCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <img 
        src={imageUrl} 
        alt={name} 
        className="w-full h-48 object-cover object-center"
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold">{name}</h3>
        <p className="text-primary font-medium text-sm">{specialization}</p>
        <div className="flex items-center mt-2">
          <div className="flex text-yellow-400">
            {Array(5).fill(0).map((_, i) => {
              if (rating >= i + 1) {
                return <i key={i} className="fas fa-star"></i>;
              } else if (rating >= i + 0.5) {
                return <i key={i} className="fas fa-star-half-alt"></i>;
              } else {
                return <i key={i} className="far fa-star"></i>;
              }
            })}
          </div>
          <span className="text-gray-600 text-sm ml-2">{rating}/5</span>
        </div>
        <p className="text-gray-600 text-sm mt-2">{propertiesSold}+ properties sold</p>
        <button 
          onClick={onContact} 
          className="w-full mt-4 bg-primary text-white py-2 rounded hover:bg-blue-600 transition"
        >
          Contact Agent
        </button>
      </div>
    </div>
  );
}

interface TestimonialCardProps {
  quote: string;
  author: string;
  role: string;
  rating: number;
  imageUrl: string;
}

export function TestimonialCard({ quote, author, role, rating, imageUrl }: TestimonialCardProps) {
  return (
    <div className="bg-gray-50 rounded-lg p-6 shadow-sm">
      <div className="flex text-yellow-400 mb-4">
        {Array(5).fill(0).map((_, i) => {
          if (rating >= i + 1) {
            return <i key={i} className="fas fa-star"></i>;
          } else if (rating >= i + 0.5) {
            return <i key={i} className="fas fa-star-half-alt"></i>;
          } else {
            return <i key={i} className="far fa-star"></i>;
          }
        })}
      </div>
      <p className="text-gray-600 italic mb-4">{quote}</p>
      <div className="flex items-center">
        <div className="w-10 h-10 bg-gray-300 rounded-full overflow-hidden mr-3">
          <img src={imageUrl} alt={author} className="w-full h-full object-cover" />
        </div>
        <div>
          <p className="font-medium">{author}</p>
          <p className="text-sm text-gray-500">{role}</p>
        </div>
      </div>
    </div>
  );
}

interface NeighborhoodCardProps {
  name: string;
  listingsCount: number;
  onClick?: () => void;
}

export function NeighborhoodCard({ name, listingsCount, onClick }: NeighborhoodCardProps) {
  return (
    <a 
      href="#" 
      className="text-dark hover:text-primary"
      onClick={(e) => {
        e.preventDefault();
        if (onClick) onClick();
      }}
    >
      <div className="bg-gray-100 rounded-lg p-4 text-center hover:bg-gray-200 transition">
        <p className="font-medium">{name}</p>
        <p className="text-sm text-gray-600">{listingsCount} listings</p>
      </div>
    </a>
  );
}
