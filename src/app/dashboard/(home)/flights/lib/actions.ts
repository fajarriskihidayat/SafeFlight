"use server";

import { ActionResult } from "@/app/dashboard/(auth)/signin/form/actions";
import { redirect } from "next/navigation";
import { formFlightSchema } from "./validation";
import prisma from "../../../../../../lib/prisma";
import { generateSeatPerClass } from "@/lib/utils";
import { revalidatePath } from "next/cache";

export async function saveFlight(
  prevState: unknown,
  formData: FormData
): Promise<ActionResult> {
  const departureDate = new Date(formData.get("departureDate") as string);
  const arrivalDate = new Date(formData.get("arrivalDate") as string);

  const validate = formFlightSchema.safeParse({
    planeId: formData.get("planeId"),
    price: formData.get("price"),
    departureCity: formData.get("departureCity"),
    departureDate,
    departureCityCode: formData.get("departureCityCode"),
    destinationCity: formData.get("destinationCity"),
    destinationCityCode: formData.get("destinationCityCode"),
    arrivalDate,
  });

  if (!validate.success) {
    const errorDesc = validate.error.issues.map((issue) => issue.message);

    return {
      errorTitle: "Error Validation",
      errorDesc,
    };
  }

  try {
    const data = await prisma.flight.create({
      data: {
        ...validate.data,
        price: Number.parseInt(validate.data.price),
      },
    });

    const seats = generateSeatPerClass(data.id);

    await prisma.flightSeat.createMany({
      data: seats,
    });
  } catch (error) {
    return {
      errorTitle: "Failed to insert data",
      errorDesc: ["Terjadi masalah pada koneksi, silahkan coba lagi"],
    };
  }

  revalidatePath("/dashboard/flights");
  redirect("/dashboard/flights");
}

export async function updateFlight(
  prevState: unknown,
  id: string | null,
  formData: FormData
): Promise<ActionResult> {
  if (!id) {
    return {
      errorTitle: "Params ID Missing",
      errorDesc: [],
    };
  }

  const departureDate = new Date(formData.get("departureDate") as string);
  const arrivalDate = new Date(formData.get("arrivalDate") as string);

  const validate = formFlightSchema.safeParse({
    planeId: formData.get("planeId"),
    price: formData.get("price"),
    departureCity: formData.get("departureCity"),
    departureDate,
    departureCityCode: formData.get("departureCityCode"),
    destinationCity: formData.get("destinationCity"),
    destinationCityCode: formData.get("destinationCityCode"),
    arrivalDate,
  });

  if (!validate.success) {
    const errorDesc = validate.error.issues.map((issue) => issue.message);

    return {
      errorTitle: "Error Validation",
      errorDesc,
    };
  }

  try {
    await prisma.flight.update({
      where: { id: id },
      data: {
        ...validate.data,
        price: Number.parseInt(validate.data.price),
      },
    });
  } catch (error) {
    return {
      errorTitle: "Failed to insert data",
      errorDesc: ["Terjadi masalah pada koneksi, silahkan coba lagi"],
    };
  }

  revalidatePath("/dashboard/flights");
  redirect("/dashboard/flights");
}

export async function deleteFlight(
  id: string
): Promise<ActionResult | undefined> {
  try {
    await prisma.flightSeat.deleteMany({ where: { flightId: id } });
    await prisma.flight.delete({ where: { id: id } });
  } catch (error) {
    return {
      errorTitle: "Failed to insert data",
      errorDesc: ["Terjadi masalah pada koneksi, silahkan coba lagi"],
    };
  }

  revalidatePath("/dashboard/flights");
}
