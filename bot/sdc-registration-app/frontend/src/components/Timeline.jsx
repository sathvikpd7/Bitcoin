const steps = ['Application', 'Shortlisting', 'Interview', 'Final Selection'];

export default function Timeline() {
  return (
    <section className="p-10">
      <h3 className="text-2xl font-semibold text-center mb-6">Recruitment Process</h3>
      <div className="flex justify-center space-x-4">
        {steps.map((step, index) => (
          <div key={index} className="flex flex-col items-center">
            <div className="w-6 h-6 bg-blue-600 rounded-full mb-2"></div>
            <span>{step}</span>
          </div>
        ))}
      </div>
    </section>
  );
}