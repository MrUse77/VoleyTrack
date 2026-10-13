/**
 * The tournament form's value shape and its empty state.
 *
 * They live in a module of their own because the form component may only export components
 * (eslint react-refresh/only-export-components) and both the create screen and the edit screen
 * need the same shape: the create screen starts from `emptyTournamentForm`, the edit screen
 * pre-fills from the fixture.
 */
export type TournamentFormValues = {
  competitionSystem: string;
  description: string;
  endDate: string;
  name: string;
  season: string;
  startDate: string;
  status: string;
  teamCount: string;
};

export const emptyTournamentForm: TournamentFormValues = {
  competitionSystem: "",
  description: "",
  endDate: "",
  name: "",
  season: "",
  startDate: "",
  status: "",
  teamCount: "",
};
