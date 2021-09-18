
function DonationInfo({ image, imagealt, label, data  }) {
  return <div className="single-option">
    <div className="option-img">
      <img src={image} alt={imagealt}/>
    </div>
    <div className="option-title">
      <span>{label}</span>
      <h4>{data}</h4>
    </div>
  </div>;
};

export default DonationInfo;