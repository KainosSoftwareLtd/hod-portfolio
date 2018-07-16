import { Project } from './project';

export const PROJECTS: Project[] = [
  { id: 22, name: 'DVSA', phase: 'Alpha', completedDate: new Date(2018, 5, 18), overall: 'Requires support', mgnt: 'Significant issues', consulting: 'Manageable', design: 'Significant issues', engineering: 'Manageable', ops: 'Manageable', security: 'Significant issues', data: 'Requires support', sector: null, department: null, agency: null, accountName: null, themes: null },
  { id: 23, name: 'Defra', phase: 'Alpha', completedDate: new Date(2017, 7, 28), overall: 'Significant issues', mgnt: 'Significant issues', consulting: 'Manageable', design: 'Significant issues', engineering: 'Manageable', ops: 'Manageable', security: 'Significant issues', data: 'Requires support', sector: null, department: null, agency: null, accountName: null, themes: null },
  { id: 24, name: 'Home Office', phase: 'Beta', completedDate: new Date(2018, 4, 10), overall: 'Significant issues', mgnt: 'Significant issues', consulting: 'Manageable', design: 'Significant issues', engineering: 'Manageable', ops: 'Manageable', security: 'Significant issues', data: 'Requires support', sector: null, department: null, agency: null, accountName: null, themes: null },
  { id: 25, name: 'Land Registry', phase: 'Beta', completedDate: new Date(2018, 3, 18), overall: 'Requires support', mgnt: 'Significant issues', consulting: 'Manageable', design: 'Significant issues', engineering: 'Manageable', ops: 'Manageable', security: 'Significant issues', data: 'Requires support', sector: null, department: null, agency: null, accountName: null, themes: null },
  { id: 26, name: 'Scottish Courts and Tribunals Service', phase: 'Alpha', completedDate: new Date(2018, 9, 20), overall: 'Significant issues', mgnt: 'Significant issues', consulting: 'Manageable', design: 'Significant issues', engineering: 'Manageable', ops: 'Manageable', security: 'Significant issues', data: 'Requires support', sector: null, department: null, agency: null, accountName: null, themes: null },
  { id: 27, name: 'FTTS-Alpha Extended', phase: 'Alpha', completedDate: null, overall: null, mgnt: null, consulting: null, design: null, engineering: null, ops: null, security: null, data: null, sector: 'private', department: 'Ministry of Justice', agency: 'Her Majesty\'s Prison & Probation Service (HMPPS) (Previously NOMS)', accountName: 'DVSA', themes: 'Delivery Partner Managed, Cloud User Research Azure' },
];