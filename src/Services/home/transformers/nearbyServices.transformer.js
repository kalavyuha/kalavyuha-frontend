import MusiceTherapy from '../../../assets/images/nearby/music_therapy.jpeg';

const FALLBACK_IMAGE = MusiceTherapy;

export const transformNearbyServices = (items = []) => {
  return items.map((it) => ({
    title: it.ServiceName || 'Service',
    image:
      it.ServiceImage &&
      it.ServiceImage !== 'NaN' &&
      !Number.isNaN(it.ServiceImage)
        ? it.ServiceImage
        : FALLBACK_IMAGE,
    action: 'BOOK NOW',
    link: `/business/${it.BussinessId || ''}`
  }));
};