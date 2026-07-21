"use client";

import React, { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

interface OdometerProps {
  max: number;
}

interface OdometerInstance {
  update: (value: number) => void;
}

export default function OdometerComponent({ max }: OdometerProps) {
  const pathname = usePathname();
  const odometerRef = useRef<HTMLDivElement | null>(null);
  const odometerInitRef = useRef<OdometerInstance | null>(null);
  const [value, setValue] = useState(0);

  useEffect(() => {
    let mounted = true;

    import("odometer").then((Odometer) => {
      if (mounted && odometerRef.current) {
        odometerInitRef.current = new Odometer.default({
          el: odometerRef.current,
          value,
        }) as unknown as OdometerInstance;
      }
    });

    return () => {
      mounted = false;
      odometerInitRef.current = null;
    };
  }, [pathname]);

  useEffect(() => {
    if (odometerRef.current && odometerInitRef.current) {
      odometerInitRef.current.update(value);
    }
  }, [value]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setValue(max);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    if (odometerRef.current) {
      observer.observe(odometerRef.current);
    }

    return () => {
      if (odometerRef.current) {
        observer.unobserve(odometerRef.current);
      }
    };
  }, [max]);

  return (
    <div ref={odometerRef} key={pathname} className="odometer">
      0
    </div>
  );
}
