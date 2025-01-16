import { useForm, SubmitHandler } from "react-hook-form";

// Define the type for your form data
type FormData = {
  fullName: string;
  email: string;
  // Add other fields here as needed
};

export default function FormBuilder() {
  const { register, handleSubmit } = useForm<FormData>();

  // Type the 'onSubmit' parameter using SubmitHandler
  const onSubmit: SubmitHandler<FormData> = (data) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="mb-4">
        <label className="block text-sm font-bold">Full Name</label>
        <input {...register("fullName")} className="border rounded p-2 w-full" />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-bold">Email</label>
        <input {...register("email")} type="email" className="border rounded p-2 w-full" />
      </div>
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
        Submit
      </button>
    </form>
  );
}
