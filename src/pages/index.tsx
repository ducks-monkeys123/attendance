import * as React from 'react';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AccessTimeFilledSharpIcon from '@mui/icons-material/AccessTimeFilledSharp';
import { useGlobal } from '../functions/global-context';
import { getData } from '../functions/realtime-database';
import { FormParameters, GatheringTimes } from '../types/types';
import { convertToGatheringTimes } from '../functions/convert';
import { JSX, useEffect } from 'react';
import { Gathering } from '../types/enums';
import { formatDayFromNumber, formatTimeFrom24hour } from '../functions/date-time';
import { Box, Card, CardContent, Grid } from '@mui/material';

export type DisplayPreSelectedGatheringsProps = {
  defaultGathering: GatheringTimes[];
};

export type DisplayGatheringsProps = {
  gatherings: GatheringTimes[];
};

// Define sorting order
const gatheringOrder: Record<Gathering, number> = {
  [Gathering.PM]: 0, // PRAYER MEETING
  [Gathering.WS]: 1, // WORSHIP SERVICE
  [Gathering.TG]: 2, // THANKSGIVING
};

// Utility: group by type (Gathering enum)
const groupByType = (data: GatheringTimes[]) => {
  // Sort by type first based on the defined order
  const sortedData = [...data].sort(
    (a, b) => gatheringOrder[a.type] - gatheringOrder[b.type]
  );

  return sortedData.reduce((acc, curr) => {
    if (!acc[curr.type]) {
      acc[curr.type] = [];
    }
    acc[curr.type].push(curr);
    return acc;
  }, {} as Record<Gathering, GatheringTimes[]>);
};

export function DisplayGatherings({ gatherings }: DisplayGatheringsProps): JSX.Element {
  const grouped = groupByType(gatherings);

  const gatheringDivs: JSX.Element[] = [];

  for (const [type, items] of Object.entries(grouped)) {
    gatheringDivs.push(
      <div key={type}>
        <Typography sx={{ mt: 4, mb: 2 }} variant="h6" component="div">
          {type}
        </Typography>
        <List>
          {items.map((entry, index) => (
            <ListItem key={index}>
              <ListItemIcon>
                {entry.current ? (
                  <AccessTimeFilledSharpIcon />
                ) : (
                  <AccessTimeIcon />
                )}
              </ListItemIcon>
              <ListItemText
                primary={`${formatDayFromNumber(entry.day)}, ${formatTimeFrom24hour(entry.time)}`}
              />
            </ListItem>
          ))}
        </List>
      </div>
    );
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
    <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
      {gatheringDivs.map((div, index) => (
        <Grid key={index} size={{ xs: 2, sm: 4, md: 4 }}>
          {div}
        </Grid>
      ))}
    </Grid>
  </Box>
  );
}

function getPreSelectedGatheringCard(gathering: GatheringTimes | null): JSX.Element {
  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {gathering ? (
            gathering.type
          ): (
            "There is no preselected gathering"
          )}
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {gathering ? (
            `${formatDayFromNumber(gathering.day)}, ${formatTimeFrom24hour(gathering.time)}`
          ) : (
            "You can either pre-selected one or select on when scaning the dialog"
          )}
        </Typography>
      </CardContent>
    </Card>
  );
}

export function PreSelectedGathering({ defaultGathering }: DisplayPreSelectedGatheringsProps): JSX.Element {
  if (defaultGathering === null) {
    return getPreSelectedGatheringCard(null);
  }
  const count = defaultGathering.length;
  if (count === 1) {
    return getPreSelectedGatheringCard(defaultGathering[0]);
  } else if (count === 0) {
    return getPreSelectedGatheringCard(null);
  } else if (count > 1) {
    const preSelectedCards = defaultGathering.map((g) => getPreSelectedGatheringCard(g));
    return <>{preSelectedCards}</>;
  }
  return <></>;
}

export default function DashboardPage(): JSX.Element {
  const { 
    formParameters, 
    setFormParameters, 
    gatherings, 
    setGatherings,
    defaultGathering,
    setDefaultGathering
  } = useGlobal();
  
  useEffect(() => {
    const fetchData = async () => {
      const data_form = await getData("google_form");
      const data_gatherings = await getData("gatherings");
  
      if (data_form && data_gatherings) {
        setFormParameters(data_form as FormParameters);
        setGatherings(convertToGatheringTimes(data_gatherings, setDefaultGathering));
      } else {
        console.log("No form data found.");
      }
    };
  
    if (!formParameters || !gatherings || gatherings.length === 0) {
      fetchData();
    }
  }, [formParameters, gatherings, setFormParameters, setGatherings]);
  

  return (
    <div>
      {formParameters ? (
        <div>
          <PreSelectedGathering defaultGathering={defaultGathering} />
          <DisplayGatherings gatherings={gatherings} />
          <Typography variant="h6">Form Parameters</Typography>
          <pre>{JSON.stringify(formParameters, null, 2)}</pre>
          <pre>{JSON.stringify(gatherings, null, 2)}</pre>
        </div>
      ) : (
        <Typography>Loading form parameters...</Typography>
      )}
    </div>
  );
}
