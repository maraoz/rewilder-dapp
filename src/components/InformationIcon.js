import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import { Popover } from '@headlessui/react'
import { usePopper } from 'react-popper';
import React, { useState } from 'react';

const InformationIcon = React.forwardRef(({ text }, refs) => {

  const [referenceElement, setReferenceElement] = useState()
  const [popperElement, setPopperElement] = useState()
  const { styles, attributes } = usePopper(referenceElement, popperElement);

  const onHover = (open, entering) => {
    if (entering && !open) {
      referenceElement?.click();
    }
    if (!entering && open) {
      referenceElement?.click();
    }
  };
  return (
    <Popover className="info-popover-root">
      {({ open }) => (
        <>
          <Popover.Button as="span" ref={setReferenceElement}
            onMouseEnter={() => onHover(open, true)}
            onMouseLeave={() => onHover(open, false)}
          >
            <FontAwesomeIcon icon={faQuestionCircle} />
          </Popover.Button>
          {
            open && <Popover.Panel static
              className="info-popover"
              ref={setPopperElement}
              style={styles.popper}
              {...attributes.popper}
            >
              {text}
            </Popover.Panel>
          }
         </>
         )}
    </Popover>
  );
});

export default InformationIcon;
