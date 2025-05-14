import * as React from "react";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import { Typography } from "@mui/material";
import Link from "@mui/material/Link";

function handleClick(event) {
  event.preventDefault();
  console.info("You clicked a breadcrumb.");
}

export default function ActiveLastBreadcrumb({ breadcrumbsArr }) {
  return (
    <div role="presentation" onClick={handleClick}>
      <Breadcrumbs
        aria-label="breadcrumb"
        sx={{ padding: "16px 0px 16px 0" }}
      >
        {breadcrumbsArr &&
          breadcrumbsArr.map((breadcrumb) => {
            return (
              <Link
                underline={breadcrumb.hover}
                color={breadcrumb.inherit}
                href={breadcrumb.path}
                aria-current={breadcrumb.page}
              >
                <Typography
                  sx={{ fontWeight: breadcrumb.page ? "bold" : "normal" }}
                  variant="subtitle2"
                >
                  {breadcrumb.title}
                </Typography>
              </Link>
            );
          })}
      </Breadcrumbs>
    </div>
  );
}
