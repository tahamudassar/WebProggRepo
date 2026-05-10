"use client";

import DefaultLayout from "@/components/DefaultLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { apiUrl, asArray } from "@/lib/api";
import React, { useEffect, useState } from "react";

function StudyLinks({ params }) {
  const [material, setMaterial] = useState([]);
  const [filteredMaterial, setFilteredMaterial] = useState([]);
  const [isMounted, setIsMounted] = useState(false); // Track if the component has mounted
  const [isMounted2, setIsMounted2] = useState(false);
  const course = params?.course;

  // Conditionally access params only after it's available

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(apiUrl("/api/materials/"));
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('data',data)
        const materials = asArray(data);
        setMaterial(materials);
        const decodedTitle = course ? decodeURIComponent(course) : "";
        if (decodedTitle) {
        const filtered = materials.filter((item) => item.title === decodedTitle);
        setFilteredMaterial(filtered);
      }
      } catch (error) {
        console.error("Failed to fetch study materials:", error);
      }
    };

    fetchData();
    setIsMounted(true);
  }, [course]);

  console.log(filteredMaterial)



  if (!isMounted || filteredMaterial.length === 0) {
    return null;
  }

  return (
    <DefaultLayout>
      <div className="pt-10">
        <div className="flex flex-wrap mt-20 justify-center gap-6">
          {filteredMaterial.map((item) => (
            <Card className="w-[200px]  max-h-60" key={item.id}>
              <CardHeader>
                <CardTitle>{item.title}</CardTitle>
                <CardDescription>
                  <div className="truncate">
                  {item.description}
                  </div>
                </CardDescription>
              </CardHeader>
              <CardFooter className="flex justify-between">
                <a target="_blank" href={item.file_url}>Open</a>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </DefaultLayout>
  );
}

export default StudyLinks;
