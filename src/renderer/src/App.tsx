import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";
import Routers from "./routers";

export default function App() {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1 * 60 * 1000, // 1분
            gcTime: 5 * 60 * 1000, // 5분
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <Routers />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
