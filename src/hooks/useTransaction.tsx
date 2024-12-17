import { User } from "lucia";
import useCheckoutData from "./useCheckoutData";
import { SEAT_VALUES, SeatValuesType } from "@/lib/utils";
import { useMemo, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";

type Props = {
  user: User | null;
};

const useTransaction = ({ user }: Props) => {
  const { data } = useCheckoutData();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const router = useRouter();

  const selectedSeat = useMemo(() => {
    return SEAT_VALUES[(data?.seat as SeatValuesType) ?? "ECONOMY"];
  }, [data?.seat]);

  const transactionMutate = useMutation({
    mutationFn: (data: any) =>
      axios.post("/api/transactions/create", data).then((res) => res.data),
  });

  const payTransaction = async () => {
    if (!data && !user) {
      return null;
    }

    const totalPrice = Number(
      data?.flightDetail?.price &&
        data.flightDetail.price + selectedSeat.additionalPrice
    );

    const bodyData = {
      bookingDate: new Date(),
      customerId: user?.id,
      flightId: data?.flightDetail?.id,
      price: totalPrice,
      seatId: data?.seatDetail?.id,
      departureCityCode: data?.flightDetail?.departureCityCode,
      destinationCityCode: data?.flightDetail?.destinationCityCode,
    };

    try {
      setIsLoading(true);

      const transaction = await transactionMutate.mutateAsync(bodyData);

      //handle midtrans
      window.snap.pay(transaction.midtrans.token, {
        onSuccess: function (result: any) {
          router.push("/success-checkout");
        },
        onPending: function (result: any) {
          router.push("/success-checkout");
        },
        onError: function (result: any) {
          alert("Transaksi gagal. Silahkan coba lagi");
        },
        onClose: function () {
          alert("Transaksi gagal. Silahkan coba lagi");
        },
      });

      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };

  return {
    payTransaction,
    isLoading,
  };
};

export default useTransaction;
