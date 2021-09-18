function DonationUpdate({ icon, iconalt, date, message, linkText, linkHref }) {
  return <div className="single-updates">
    <div className="update-close">
      <i className="fal fa-times"></i>
    </div>
    <div className="update-icon">
        <img src={icon} alt={iconalt}/>
    </div>
    <div className="update-content">
      <span>{date}</span>
      <h4>{message}</h4>
      <a href={linkHref} target="_blank">{linkText}</a>
    </div>
  </div>;
};

export default DonationUpdate;