function DonationInfo({ image, imagealt, label, data  }) {
  return <div className="donation-info">
    <div className="donation-img">
      <img src={image} alt={imagealt}/>
    </div>
    <div>
      <span>{label}</span>
      <h4>{data}</h4>
    </div>
  </div>;
};

export default DonationInfo;