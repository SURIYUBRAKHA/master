import React, { useState, useEffect } from 'react'
import { useLocalStorage } from 'react-use'
import { WindowModal, MarkdownContainer, Button } from '../../../gameItems/components'
import {
  getChallengeReadme,
  parseGithubReadme,
  splitGithubReadmeIntoSections
} from '../../../../helpers'
import { LEVEL_ID } from '..'

const ChallengeWindow = ({
  isOpen,
  continueDialog,
  setContractWindowVisibility,
  setChallengeWindowVisibility
}) => {
  const [currentStep, setCurrentStep] = useLocalStorage(`${LEVEL_ID}-currentStep`, 1)

  const [challengeSections, setChallengeSections] = useState([])

  useEffect(() => {
    getChallengeReadme(
      'https://raw.githubusercontent.com/scaffold-eth/scaffold-eth-challenges/challenge-3-dice-game/README.md'
    )
      .then(text => {
        const parsed = parseGithubReadme(text)
        const sections = splitGithubReadmeIntoSections(parsed)
        setChallengeSections(sections)
      })
      .catch(e => console.error(e))
  }, [])

  return (
    <WindowModal
      initTop={10}
      initLeft={window.innerWidth * 0.3}
      initHeight={window.innerHeight * 0.95}
      initWidth={window.innerWidth * 0.5}
      backgroundPath='./assets/items/window.png'
      dragAreaHeightPercent={12}
      windowTitle='Dice Game Challenge'
      isOpen={isOpen}
      contentContainerStyle={{ paddingTop: 0 }}
    > 
      <div
        className='content'
        style={{
          float: 'left',
          width: '100%',
          height: '100%',
          overflowY: 'auto',
          overflowX: 'hidden',
          lineHeight: 2.2
        }}
      >
        {challengeSections.map((section, index) => {
          if (currentStep >= index) {
            return <MarkdownContainer>{section}</MarkdownContainer>
          }
        })}

        {currentStep < challengeSections.length && (
          <Button
            style={{ marginTop: 20, marginBottom: 40 }}
            onClick={() => {
              setCurrentStep(currentStep + 1)
            }}
          >
            Continue
          </Button>
        )}
        {currentStep >= challengeSections.length && (
          <Button
            className='is-warning'
            onClick={() => {
              continueDialog()
              setChallengeWindowVisibility(false)
              setContractWindowVisibility(false)
            }}
          >
            Done
          </Button>
        )}
      </div>
    </WindowModal>
  )
}

export default ChallengeWindow
