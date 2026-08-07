export const colors = {
  bg: '#0E1116',
  surface: '#171B22',
  surface2: '#1F242D',
  surface3: '#272E38',
  line: '#2A3038',
  amber: '#FFB627',
  amberDim: '#B8811C',
  amberSoft: 'rgba(255,182,39,0.14)',
  cream: '#F5F3EE',
  textDim: '#93A0AC',
  textFaint: '#5B6570',
  success: '#3DD68C',
  successSoft: 'rgba(61,214,140,0.14)',
  danger: '#FF6B57',
  dangerSoft: 'rgba(255,107,87,0.14)',
  info: '#5FA8FF',
} as const;

export type ColorKey = keyof typeof colors;
