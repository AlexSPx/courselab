import axios, { AxiosResponse } from "axios";
import {
  ErrorModal,
  LoadingModal,
  SuccessModal,
  useModals,
} from "../components/Modal";

export default function useRequest() {
  const { pushModal, closeModal } = useModals();

  const executeQuery = async (
    query: () => Promise<AxiosResponse<any>>,
    {
      loadingTitle = "Loading",
      loadingBody = "This might take a bit",
      successTitle = "Success",
      successBody = "Everything is set",
      onSuccess,
      onFail,
      successStatus = 200,
    }: {
      loadingTitle?: string;
      loadingBody?: string;
      successTitle?: string;
      successBody?: string;
      onSuccess?: (data: AxiosResponse<any>) => void;
      onFail?: Function;
      successStatus?: number;
    } = {}
  ) => {
    const ackey = Date.now();

    pushModal(
      <LoadingModal
        key={ackey}
        title={`${loadingTitle}`}
        body={`${loadingBody}`}
      />,
      { timer: false }
    );

    try {
      const data = await query();

      if (data.status === successStatus || data.status === 201) {
        if (onSuccess) onSuccess(data);
        closeModal(ackey);
        pushModal(
          <SuccessModal
            title={`${successTitle}`}
            body={`${successBody}`}
            key={Date.now()}
          />,
          {
            value: 3000,
          }
        );
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          closeModal(ackey);
          if (onFail) onFail();
          pushModal(
            <ErrorModal
              title="Error"
              body={JSON.stringify(error.response.data)}
              key={Date.now()}
            />
          );
        }
      } else {
        pushModal(
          <ErrorModal title="Error" body="An unexpected error has occurred" />
        );
      }
    }
  };

  return { executeQuery };
}
