"use client";

import Loading from "@/components/Loading";
import { useListBootcampsQuery } from "@/state/api";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import BootcampCardSearch from "@/components/BootcampCardSearch";
import SelectedBootcamp from "./SelectedBootcamp";

const BootcampSearch = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const query = searchParams.get("query")?.toLowerCase() || "";
  const { data: allBootcamps, isLoading, isError } = useListBootcampsQuery({});
  const [bootcamps, setBootcamps] = useState<Bootcamp[]>([]);
  const [selectedBootcamp, setSelectedBootcamp] = useState<Bootcamp | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (allBootcamps) {
      let filtered = allBootcamps.filter((b: Bootcamp) => b.status === "Published");

      if (query) {
        filtered = filtered.filter((b: Bootcamp) =>
          b.title.toLowerCase().includes(query)
        );
      }

      setBootcamps(filtered);

      if (id) {
        const match = filtered.find((b) => b._id === id);
        setSelectedBootcamp(match || filtered[0]);
      } else {
        setSelectedBootcamp(filtered[0]);
      }
    }
  }, [allBootcamps, id, query]);

  if (isLoading) return <Loading />;
  if (isError || !bootcamps) return <div>Failed to fetch bootcamps</div>;

  const handleBootcampSelect = (bootcamp: Bootcamp) => {
    setSelectedBootcamp(bootcamp);
    router.push(`/bootcamp-search?id=${bootcamp._id}${query ? `&query=${query}` : ""}`, {
      scroll: false,
    });
  };

  const handleEnrollNow = (bootcampId: string) => {
    router.push(`/checkout?step=1&id=${bootcampId}&type=bootcamp&showSignUp=false`, {
      scroll: false,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="search"
    >
      <h1 className="search__title">List of available bootcamps</h1>
      <h2 className="search__subtitle">{bootcamps.length} bootcamps available</h2>
      <div className="search__content grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-6">
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="search__courses-grid max-h-[calc(100vh-200px)] overflow-y-auto"
        >
          {bootcamps.map((bootcamp) => (
            <BootcampCardSearch
              key={bootcamp._id}
              bootcamp={bootcamp}
              isSelected={selectedBootcamp?._id === bootcamp._id}
              onClick={() => handleBootcampSelect(bootcamp)}
            />
          ))}
        </motion.div>

        {selectedBootcamp && (
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="search__selected-course max-h-[calc(100vh-200px)] overflow-y-auto"
          >
            <SelectedBootcamp
              bootcamp={selectedBootcamp}
              handleEnrollNow={handleEnrollNow}
            />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default BootcampSearch;