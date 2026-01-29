
import React, { useEffect, useState } from 'react';
import { ProductCard } from '../components/ProductCard';
import { useAppContext } from '../context/AppContext';
import { Sparkles } from 'lucide-react';
import { getAIProductRecommendations } from '../services/geminiService';

export const Home: React.FC = () => {
  const { products, searchQuery } = useAppContext();
  const [recommendedIds, setRecommendedIds] = useState<string[]>([]);
  const [isAiThinking, setIsAiThinking] = useState(false);

  useEffect(() => {
    const fetchAiRecs = async () => {
      if (searchQuery.length > 2) {
        setIsAiThinking(true);
        const recs = await getAIProductRecommendations(searchQuery, products);
        setRecommendedIds(recs);
        setIsAiThinking(false);
      } else {
        setRecommendedIds([]);
      }
    };
    
    const timeout = setTimeout(fetchAiRecs, 500);
    return () => clearTimeout(timeout);
  }, [searchQuery]);

  const sortedProducts = [...products].sort((a, b) => {
    const aIdx = recommendedIds.indexOf(a.id);
    const bIdx = recommendedIds.indexOf(b.id);
    if (aIdx !== -1 && bIdx !== -1) return aIdx - bIdx;
    if (aIdx !== -1) return -1;
    if (bIdx !== -1) return 1;
    return 0;
  });

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      {!searchQuery && (
        <section className="relative overflow-hidden rounded-3xl bg-indigo-900 py-20 px-8 text-center text-white">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-indigo-900 to-violet-900 opacity-90"></div>
          <div className="relative z-10 max-w-3xl mx-auto space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Curated by Intelligence, <br />
              <span className="text-indigo-300">Crafted for Excellence.</span>
            </h1>
            <p className="text-lg text-indigo-100/80">
              Discover the next generation of lifestyle essentials powered by AI-driven personalization.
            </p>
            <button className="px-8 py-3 bg-white text-indigo-900 rounded-full font-bold hover:bg-indigo-50 transition-all shadow-xl">
              Shop the Collection
            </button>
          </div>
        </section>
      )}

      {/* AI Indicator */}
      {isAiThinking && (
        <div className="flex items-center justify-center gap-2 text-indigo-600 animate-pulse">
          <Sparkles className="w-5 h-5" />
          <span className="text-sm font-medium">AI is personalizing results...</span>
        </div>
      )}

      {/* Product Grid */}
      <section>
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">
              {searchQuery ? `Search results for "${searchQuery}"` : "Featured Collection"}
            </h2>
            <p className="text-gray-500 mt-1">Explore our high-quality selection.</p>
          </div>
          <div className="flex gap-2">
            {['All', 'Electronics', 'Fashion'].map(cat => (
              <button key={cat} className="px-4 py-1.5 rounded-full border border-gray-200 text-sm font-medium hover:bg-gray-50">
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {sortedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {sortedProducts.length === 0 && (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
            <p className="text-gray-500">No products found. Try another search!</p>
          </div>
        )}
      </section>
    </div>
  );
};
