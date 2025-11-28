export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-10 rounded shadow max-w-md text-center">
        <h1 className="text-3xl font-bold text-blue-600 mb-4">
          Revisá tu correo
        </h1>

        <p className="text-gray-700">
          Te enviamos un email para confirmar tu cuenta.
        </p>

        <p className="mt-3 text-sm text-gray-500">
          Si no aparece, revisá la carpeta de spam.
        </p>

        <a
          href="/login"
          className="mt-6 inline-block bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
        >
          Ir al login
        </a>
      </div>
    </div>
  );
}
