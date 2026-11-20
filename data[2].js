// Sample campus graph. REPLACE names/landmarks with real ones from your campus survey.
// t = path | ramp | steps | door | stairs | lift | corridor | bridge ; d = metres ; f = floor
const NODES = {
  gate:{n:"Main Gate",f:0}, quad:{n:"Central Quad",f:0},
  lib_ent:{n:"Library entrance",f:0}, lib_g:{n:"Library ground floor",f:0}, lib_1:{n:"Library first floor",f:1},
  sci_ent:{n:"Science Block entrance",f:0}, sci_g:{n:"Science Block ground floor",f:0}, sci_1:{n:"Science Block first floor",f:1},
  adm_ent:{n:"Admin Block entrance",f:0}, adm_g:{n:"Admin Block ground floor",f:0}, adm_1:{n:"Admin Block first floor",f:1}
};
const LIFTS = {lift_lib:"Library lift", lift_sci:"Science Block lift", lift_adm:"Admin Block lift"};
const EDGES = [
  {a:"gate",b:"quad",t:"path",d:120,lm:"Wide paved path with tall trees on your right"},
  {a:"quad",b:"lib_ent",t:"steps",d:20,n:6,up:1,lm:"Handrail on both sides, glass doors at the top"},
  {a:"quad",b:"lib_ent",t:"ramp",d:45,lm:"Gentle ramp with a handrail, starting beside the bicycle stand"},
  {a:"lib_ent",b:"lib_g",t:"door",d:8,lm:"Heavy glass door, push to open; reception desk straight ahead"},
  {a:"lib_g",b:"lib_1",t:"stairs",d:15,lm:"Staircase beside the notice board"},
  {a:"lib_g",b:"lib_1",t:"lift",d:20,id:"lift_lib",lm:"Lift next to the water cooler"},
  {a:"quad",b:"sci_ent",t:"ramp",d:50,lm:"Wide ramp with smooth tiles, flagpole on your left"},
  {a:"sci_ent",b:"sci_g",t:"door",d:8,lm:"Automatic sliding door"},
  {a:"sci_g",b:"sci_1",t:"stairs",d:18,lm:"Staircase opposite the lab notice boards"},
  {a:"sci_g",b:"sci_1",t:"lift",d:25,id:"lift_sci",lm:"Lift beside the vending machine"},
  {a:"quad",b:"adm_ent",t:"path",d:45,lm:"Flat paved path with a fountain on your left"},
  {a:"adm_ent",b:"adm_g",t:"door",d:6,lm:"Automatic door; help desk straight ahead"},
  {a:"adm_g",b:"adm_1",t:"stairs",d:14,lm:"Staircase behind the help desk"},
  {a:"adm_g",b:"adm_1",t:"lift",d:18,id:"lift_adm",lm:"Lift to the right of the help desk"},
  {a:"lib_g",b:"sci_g",t:"corridor",d:35,lm:"Covered walkway; the floor changes from carpet to tile halfway"},
  {a:"lib_1",b:"sci_1",t:"bridge",d:30,lm:"Glass-sided first-floor bridge with railings on both sides"}
];
