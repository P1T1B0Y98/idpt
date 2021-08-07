import React, {
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react';
import PropTypes from 'prop-types';
import { Col, Upload, Button, Input, Row } from 'antd';
import styled from 'styled-components';

const AudioPlayer = styled.audio`
  max-width: 100%;
`;

const PlaceHolder = styled.div`
  margin-bottom: 0;
`;

const Source = styled.p`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 0;
  padding: 5px;
`;

const Container = styled.div`
  background: white;
`;

const styles = {
  inputSource: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnSave: {
    marginLeft: 5,
  },
  input: {
    display: 'flex',
    justifyContent: 'center',
  },
  audio: {
    width: '100%',
  },
  button: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    margin: 'auto',
  },
  text: {
    color: '#666',
    marginLeft: 0,
  },
  icon: {
    fontSize: 32,
    color: '#999',
  },
  btnWidth: {
    width: 130,
  },
  placeholder: {
    cursor: 'pointer',
    padding: 5,
    backgroundColor: 'white',
  },
};

function Audio(props) {
  const { section, onChange, parentId, editMode } = props;
  const [url, setUrl] = useState('');
  const [isInputUrl, setIsInputUrl] = useState(false);
  const containerRef = useRef(null);

  const handleInputSource = useCallback((e) => {
    const { target } = e;
    setUrl(target.value);
  }, []);

  const handleSave = useCallback(
    (url) => {
      onChange(
        section.id,
        url,
        parentId,
        section.columnPosition,
      );
      resetData();
    },
    [url, isInputUrl],
  );

  const source = useMemo(() => {
    return section.value;
  }, [section]);

  const resetData = () => {
    if (isInputUrl) {
      setIsInputUrl(false);
    }
    if (url) {
      setUrl('');
    }
  };

  const renderInput = () => {
    if (!editMode) {
      return source ? (
        <div style={section.style}>
          <AudioPlayer controls>
            <source src={source} type="audio/ogg" />
            <source src={source} type="audio/mpeg" />
          </AudioPlayer>
        </div>
      ) : (
        <div style={styles.placeholder}>
          <PlaceHolder>Click to edit</PlaceHolder>
        </div>
      );
    }
    if (isInputUrl) {
      return (
        <Row>
          <Col
            style={{
              display: 'flex',
              paddingBottom: 5,
            }}
            span={12}
            offset={6}
          >
            <Input
              placeholder="Audio source"
              onChange={handleInputSource}
              autoFocus
            />
            <Button
              style={styles.btnSave}
              onClick={() => handleSave(url)}
            >
              Save
            </Button>
            <Button
              style={{ marginLeft: 5 }}
              onClick={() => setIsInputUrl(false)}
            >
              Cancel
            </Button>
          </Col>
        </Row>
      );
    } else {
      return (
        <div style={{ backgroundColor: 'white' }}>
          <Row justify="center">
            <Col span={24} style={styles.button}>
              <Upload accept="audio/*">
                <Button style={styles.btnWidth}>
                  <span style={styles.text}>
                    Upload audio
                  </span>
                </Button>
              </Upload>
            </Col>
          </Row>
          <Row style={{ padding: '5px 0' }}>
            <Button
              style={{
                ...styles.button,
                ...styles.btnWidth,
              }}
              onClick={() => setIsInputUrl(true)}
            >
              <span style={styles.text}>Just add url</span>
            </Button>
          </Row>
        </div>
      );
    }
  };

  const renderAudio = () => {
    if (!editMode) {
      return (
        <Source
          style={{
            maxWidth: containerRef.current
              ? containerRef.current.offsetWidth
              : 'unset',
          }}
        >
          {source}
        </Source>
      );
    } else {
      return (
        <div>
          <div style={section.style}>
            <AudioPlayer
              controls
              style={{ verticalAlign: 'middle' }}
            >
              <source src={source} type="audio/ogg" />
              <source src={source} type="audio/mpeg" />
            </AudioPlayer>
          </div>
          <hr style={{ border: 'solid 1px #e3e3e3' }} />
          {renderInput()}
        </div>
      );
    }
  };

  return (
    <Container ref={containerRef}>
      {source ? renderAudio() : renderInput()}
    </Container>
  );
}

Audio.defaultProps = {
  isContainerContent: false,
};

Audio.propTypes = {
  section: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  parentId: PropTypes.string.isRequired,
  isContainerContent: PropTypes.bool,
};

const renderAudio = (props) => {
  return <Audio {...props} />;
};

export default renderAudio;
