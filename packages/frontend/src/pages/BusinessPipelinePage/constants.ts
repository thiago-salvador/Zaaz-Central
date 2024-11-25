export const PIPELINE_STAGES = [
  'First contact',
  'Study / Analyze client',
  'First meeting',
  'Prototype',
  'Follow up meetings',
  'Proposal',
  'Negotiation / Contracting',
  'Discovery'
] as const;

export const STAGE_COLORS = {
  'First contact': '#64B5F6',
  'Study / Analyze client': '#81C784',
  'First meeting': '#BA68C8',
  'Prototype': '#4FC3F7',
  'Follow up meetings': '#4DB6AC',
  'Proposal': '#7986CB',
  'Negotiation / Contracting': '#F06292',
  'Discovery': '#FFD54F'
} as const;

export const STAGE_DESCRIPTIONS = {
  'First contact': 'First interaction with the potential client',
  'Study / Analyze client': 'Research and analysis of client needs and requirements',
  'First meeting': 'Initial face-to-face or virtual meeting with client',
  'Prototype': 'Development of initial prototype or proof of concept',
  'Follow up meetings': 'Subsequent meetings to discuss progress and requirements',
  'Proposal': 'Formal proposal submission',
  'Negotiation / Contracting': 'Contract negotiation and finalization',
  'Discovery': 'Detailed project discovery and planning'
} as const;
