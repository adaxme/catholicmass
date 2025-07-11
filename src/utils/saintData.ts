import { Saint } from '../types';

// Sample saint data - in production, this could come from an API
const saintData: Record<string, Saint> = {
  // January
  '01-01': {
    name: 'Mary, Mother of God',
    feast: 'Solemnity of Mary, Mother of God',
    biography: 'We honor Mary as the Mother of God and the Mother of the Church. This solemnity celebrates her divine motherhood and her role in our salvation. Mary said yes to God\'s plan and became the Mother of Jesus Christ, true God and true man.'
  },
  '01-02': {
    name: 'Saints Basil the Great and Gregory Nazianzen',
    feast: 'Memorial',
    biography: 'Two great doctors of the Church from the 4th century. Saint Basil was a bishop known for his care of the poor and his theological writings. Saint Gregory Nazianzen was a brilliant theologian and poet who defended the divinity of Christ.'
  },
  '01-03': {
    name: 'Holy Name of Jesus',
    feast: 'Optional Memorial',
    biography: 'We honor the holy name of Jesus, which means "God saves." This name was given to our Lord by the angel Gabriel at the Annunciation. The name Jesus expresses both his identity and his mission of salvation.'
  },
  // Add more saints throughout the year...
  default: {
    name: 'Saint of the Day',
    feast: 'Daily Commemoration',
    biography: 'Today we remember the saints who have gone before us, marked with the sign of faith. Though we may not know their names, we join with all the saints in heaven in praising God and seeking their intercession.'
  }
};

export function getSaintOfTheDay(date: Date = new Date()): Saint {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const key = `${month}-${day}`;
  
  return saintData[key] || saintData.default;
}