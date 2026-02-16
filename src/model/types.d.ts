interface SidebarCounts {
  cancelled: number;
  in: {
    all_count: number;
    executing: number;
    for_above: number;
    for_information: number;
    in_approval: number;
    in_signing: number;
  };
  out: {
    all_count: number;
    executing: number;
    for_above: number;
    for_information: number;
    in_approval: number;
    in_signing: number;
  };
  my_letter: number;
}
