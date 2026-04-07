"use client";

import DefaultLayout from "@/components/DefaultLayout";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

function StudyMaterial() {
  const [material, setMaterial] = useState([]);
  const [courseNames, setCourseNames] = useState([]);
  const [isMounted, setIsMounted] = useState(false); // Track if the component has mounted

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/materials/");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setMaterial(data);

        const titles = data.map((item) => item.title);
        const unique = [...new Set(titles)]; // Remove duplicates using Set
        setCourseNames(unique);
      } catch (error) {
        console.error("Failed to fetch study materials:", error);
      }
    };

    fetchData();
    setIsMounted(true); // Mark the component as mounted
  }, []);

  console.log(material)

  // Prevent rendering courseNames until after hydration
  if (!isMounted) {
    return null;
  }

  return (
    <DefaultLayout>
      <div className="pt-10">
        <h1 className="text-white text-center text-2xl">Study Material</h1>
        <div className="mt-36 flex gap-4 flex-wrap justify-center">
          {courseNames.map((course) => (
            <Link key={course} href={`/studyMaterial/${course}`}>
              <Card className="w-[200px] cursor-pointer min-h-[80px]">
                <CardHeader>
                  <CardTitle>{course}</CardTitle>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </DefaultLayout>
  );
}

export default StudyMaterial;
