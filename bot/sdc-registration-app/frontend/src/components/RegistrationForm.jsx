import { useState } from 'react';

export default function RegistrationForm() {
  const [response, setResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResponse(null); // Clear previous response
    setIsLoading(true); // Start loading

    try {
      const formData = new FormData(e.target);
      const data = Object.fromEntries(formData.entries());
      
      // Handle languages field
      const languagesStr = formData.get('languages');
      data.languages = languagesStr;

      console.log('Submitting data:', data);

      const res = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      console.log('Server response:', result);
      
      if (!res.ok) {
        throw new Error(result.message || 'Submission failed');
      }

      setResponse({ success: true, message: result.message });
      // Clear form on success
      e.target.reset();
    } catch (error) {
      console.error('Submission error:', error);
      setResponse({ success: false, message: error.message || 'Submission failed' });
    } finally {
      setIsLoading(false); // End loading
    }
  };

  return (
    <section id="register" className="p-8 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center">Join SDC</h2>

      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4 text-center">📌 Registration Process</h3>
        <div className="flex flex-col md:flex-row md:justify-between items-center text-center space-y-4 md:space-y-0">
          {['Application', 'Shortlisting', 'Interview', 'Final Selection'].map((step, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <div className="w-6 h-6 bg-blue-600 rounded-full mb-2"></div>
              <p className="text-sm">{step}</p>
              {idx !== 3 && <div className="hidden md:block w-24 border-t-2 border-blue-400 mt-2"></div>}
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="fullName" placeholder="Full Name" required className="w-full p-2 border" />
        <input name="email" type="email" placeholder="Email" required className="w-full p-2 border" />
        <input name="phone" placeholder="Phone Number" required className="w-full p-2 border" />
        <input name="college" placeholder="University/College Name" required className="w-full p-2 border" />
        <input name="departmentYear" placeholder="Department & Year" required className="w-full p-2 border" />

        <select name="experience" required className="w-full p-2 border">
          <option value="">Programming Experience</option>
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
        </select>

        <label className="block">Programming Languages (mention which languages you know):</label>
        <textarea
          name="languages"
          placeholder="e.g., Python, Java, JavaScript"
          className="w-full p-2 border"
          rows="3"
        />

        <textarea name="motivation" placeholder="Why join SDC?" required className="w-full p-2 border" />
        <textarea name="skillsToGain" placeholder="Skills to gain" required className="w-full p-2 border" />

        <input name="hoursPerWeek" placeholder="Hours/week you can commit" required className="w-full p-2 border" />
        <select name="preferredTime" required className="w-full p-2 border">
          <option value="">Preferred Time</option>
          <option value="Weekdays">Weekdays</option>
          <option value="Weekends">Weekends</option>
        </select>

        <button 
          type="submit" 
          className={`bg-blue-600 text-white px-4 py-2 rounded ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}`}
          disabled={isLoading}
        >
          {isLoading ? 'Submitting...' : 'Submit'}
        </button>
        {response && (
          <p className={response.success ? 'text-green-600' : 'text-red-600'}>{response.message}</p>
        )}
      </form>
    </section>
  );
}