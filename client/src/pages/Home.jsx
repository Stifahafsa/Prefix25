export default function Home({ onLoginClick }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold mb-6 text-primaire">Bienvenue au Centre Culturel de Ouarzazate</h1>
      <p className="text-lg text-gray-700 mb-4">
        Découvrez nos événements, ateliers et talents locaux.
      </p>
      <button
        className="bg-gray-900 text-white px-4 py-2 rounded"
        onClick={onLoginClick}
      >
        Se connecter
      </button>
    </div>
  );
}