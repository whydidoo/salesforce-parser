import {
  Box,
  Container,
  Grid,
  IconButton,
  Paper,
  TextField,
  Typography,
  styled,
} from "@mui/material";

import { useState } from "react";
import { regExURL, regExpInitBootstrap, sha256 } from "./utils";
import { IconCopy } from "@tabler/icons-react";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  padding: theme.spacing(1),
  color: theme.palette.text.secondary,
  whiteSpace: "pre",
}));

const formatData = (hashDomain: string, content: any) => {
  const obj: Record<string, string> = {};

  obj[hashDomain] = content;

  return JSON.stringify(obj, null, "\t");
};

export const App: React.FC = () => {
  const [snipet, setSnipet] = useState("");
  const [hashDomain, setHashDomain] = useState("");

  let content: any = {};

  if (snipet) {
    try {
      const matchInit = snipet.match(regExpInitBootstrap);

      let obj: Record<string, string> = {};

      if (matchInit) {
        const test = matchInit[0];

        const startIndex = test.indexOf("(");
        const endIndex = test.indexOf(")");
        const [id, chatID, chatURL, parseToString] = test
          .substring(startIndex + 1, endIndex)
          .replace(/(\r\n|\n|\r|\t)/gm, "")
          .split(",")
          .map((item) => item.replaceAll("'", ""));

        obj = {
          id,
          chatID,
          chatURL,
          scrt2URL: parseToString.match(regExURL)?.[0] ?? "",
        };
      }

      const scriptPart = snipet.split("<script")[2];

      if (scriptPart) {
        obj.scriptURL = scriptPart.match(regExURL)?.[0] ?? "";
      }

      content = obj;
    } catch (err) {
      content = err;
    }
  }

  const sopyParams = async () => {
    const text = document.getElementById("json_content")?.innerHTML || "";

    try {
      let strCopy = "";
      const obj = JSON.parse(text);

      Object.keys(obj).forEach((key) => {
        strCopy += `"${key}": ${JSON.stringify(obj[key])}`;
      });
      await navigator.clipboard.writeText(strCopy);
      console.log("Content copied to clipboard");
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  return (
    <Container>
      <Typography color="black" component="h3" marginBottom={4} variant="h4">
        Parse snippets for Sales Force
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={5}>
          <Item>
            <Box width="100%" mb={2}>
              <TextField
                placeholder="for example exness.com"
                label="Domain"
                fullWidth
                onChange={async (ev) => {
                  if (regExURL.test(ev.target.value)) {
                    const { hostname } = new URL(ev.target.value);
                    const hashDomain = await sha256(hostname);

                    return setHashDomain(hashDomain);
                  }

                  if (ev.target.value) {
                    const hashDomain = await sha256(ev.target.value);

                    return setHashDomain(hashDomain);
                  }

                  setHashDomain("");
                }}
              />
            </Box>

            <TextField
              placeholder=""
              multiline
              rows={20}
              fullWidth
              label="PRODUCTION CODE SNIPPET"
              value={snipet}
              onChange={(ev) => setSnipet(ev.target.value)}
            />
          </Item>
        </Grid>
        <Grid item xs={7}>
          <Item
            sx={{
              fontSize: 11,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <div id="json_content">
              {hashDomain ? formatData(hashDomain, content) : "Domain is empty"}
            </div>
            {hashDomain && (
              <IconButton onClick={sopyParams}>
                <IconCopy />
              </IconButton>
            )}
          </Item>
        </Grid>
      </Grid>
    </Container>
  );
};
