function Logo({channel,className,style}) {
  return(
    <svg className={className} style={style}>
      <use xlinkHref={`#${channel}`} />
    </svg>
  );
}

export default Logo;