import { toast } from 'react-toastify';
import { useLoading } from '@/context/loading-context';
import { AxiosError } from 'axios';



export default function Workspaces() {

  const { onLoading, offLoading } = useLoading();

  async function selectWorkspaces() {
    await onLoading();
    try {
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error(error);
        return toast.error(
          error.response?.data?.message || 'Algo deu errado, tente novamente.',
        );
      }
    } finally {
      await offLoading();
    }
  }

  return (
    <>
      <main className="">
        <section className="flex flex-col gap-5 items-start justify-start py-5 px-10">
          <div className="w-full">
            <h1 className="text-2xl font-semibold">Workspaces</h1>
          </div>
        </section>
      </main>
    </>
  );
}
