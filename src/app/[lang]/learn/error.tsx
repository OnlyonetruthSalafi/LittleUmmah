"use client";

import { ErrorPage, type ErrorPageProps } from "@/components/layout/ErrorPage";

export default function LearnError(props: ErrorPageProps) {
  return <ErrorPage {...props} embedded />;
}
