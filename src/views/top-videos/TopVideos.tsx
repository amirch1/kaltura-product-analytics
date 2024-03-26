import React, {useEffect} from 'react';
import './TopVideos.css';
import {Dayjs} from "dayjs";

export interface TopVideosProps {
    dateRange: [Dayjs, Dayjs];
}

function TopVideos(props: TopVideosProps) {
    const {dateRange} = props;

    useEffect(() => {
        console.log("load report!", dateRange);
    }, [dateRange]);

  return (
      <span>Top Videos</span>
  );
}

export default TopVideos;
