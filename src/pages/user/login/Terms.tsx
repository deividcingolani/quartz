// eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
import React, { FC } from 'react';
import { Button, Label, Labeling, Popup, Value } from '@logicalclocks/quartz';
import { Box, BoxProps, Flex } from 'rebass';

export interface TermsProps {
  onClose: () => void;
}

export type DotProps = Omit<BoxProps, 'css'>;

const Dot: FC<DotProps> = (props) => (
  <Box
    backgroundColor="black"
    minWidth="6px"
    minHeight="6px"
    maxWidth="6px"
    maxHeight="6px"
    sx={{
      borderRadius: '50%',
    }}
    {...props}
  />
);

const Terms: FC<TermsProps> = ({ onClose }) => (
  <Popup
    isOpen={true}
    width="440px"
    onClose={onClose}
    title=""
    sx={{
      div: {
        div: {
          div: {
            pr: '10px',
            py: '20px',
            m: '-20px',
            backgroundColor: 'red !important',
          },
        },
      },
    }}
  >
    <Flex
      p="20px"
      overflow="auto"
      flexDirection="column"
      height="calc(100vh - 300px)"
    >
      <Label mb="20px" fontSize="18px">
        Terms and conditions
      </Label>
      <Value>Agreement</Value>
      <Labeling mt="8px">
        Hopsworks is software-as-a-service (SaaS) for Apache Hadoop, Apache
        Spark, Apache Flink, Apache Hive, and Elasticsearch.
      </Labeling>
      <Value mt="20px">Definitions</Value>

      <Flex mt="8px">
        <Dot mx="8px" mt="5px" />
        <Labeling>
          User – the data owner acting as the controller, the legally
          responsible party who uploads the data on the platform.
        </Labeling>
      </Flex>

      <Flex mt="8px">
        <Dot mx="8px" mt="5px" />
        <Labeling>
          Hopsworks platform – the processor who processes the data on behalf of
          the controller
        </Labeling>
      </Flex>

      <Flex mt="20px">
        <Labeling mr="8px">1.</Labeling>
        <Value mr="3px">Legal basis for processing: </Value>
        <Labeling>The law applicable to the </Labeling>
      </Flex>
      <Labeling ml="15px">
        processing of data is the law that applies in the country where the user
        is established, no matter where the data is processed. The user
        undertakes to strictly follow a research protocol and only act within
        the limits of any given consent, alternatively any other legal ground
        within the applicable law, for example a permission from an ethical
        review board to allow re-use of previously consented data. In order to
        secure the above mentioned, the user is to provide evidence of research
        approval for each study processed within the platform, according to the
        forms set out in the platform.
      </Labeling>
      <Flex ml="15px" mt="8px">
        <Dot ml="5px" mr="8px" mt="5px" />
        <Labeling>
          User - the data owner acting as the controller, the legally
          responsible party who uploads the data on the platform.
        </Labeling>
      </Flex>

      <Flex mt="8px" ml="15px">
        <Dot ml="5px" mr="8px" mt="5px" />
        <Labeling>
          Hopsworks platform – the processor who processes the data on behalf of
          the controller
        </Labeling>
      </Flex>

      <Flex mt="20px">
        <Labeling mr="5px">2.</Labeling>
        <Value mr="3px">Secrecy clause: </Value>
        <Labeling>All personal data acquired by the Platform from</Labeling>
      </Flex>
      <Labeling ml="15px">
        All personal data acquired by the Platform from the user shall only be
        used for the purposes of this agreement and shall not be further
        processed or disclosed without the consent of the user. This does not
        preclude the platform from allowing access to auditing services under
        this agreement, or any legally binding requests for disclosure of
        personal data.
      </Labeling>

      <Flex mt="20px">
        <Labeling mr="5px">3.</Labeling>
        <Value mr="3px">Transparency: </Value>
        <Labeling>All processing of the data within the Hopsworks</Labeling>
      </Flex>
      <Labeling ml="15px">
        platform is conducted by the platform itself. If any subcontractors will
        be involved in the future, the Hopsworks Platform undertakes to inform
        the user in writing. If the user does not want to continue using the
        Hopsworks Platform services under these conditions, the platform will
        take care to end its services under controlled forms, as set out in
        point 13. Termination of the contract.
      </Labeling>

      <Flex mt="20px">
        <Labeling mr="5px">4.</Labeling>
        <Value mr="3px">Changes in the Services: </Value>
        <Labeling>If in the future changes will be made</Labeling>
      </Flex>
      <Labeling ml="15px">
        in the service that requires the installation of new software, libraries
        or hardware devices on the users systems, the Hopsworks will inform the
        user about this, and in particular about its implications from a data
        protection and data security point of view. The user agrees to provide
        the data subjects with information on where the data is being processed,
        in the event the data subject would want his/her data erased or changed.
      </Labeling>

      <Flex mt="20px">
        <Labeling mr="5px">5.</Labeling>
        <Value mr="3px">Purpose binding:</Value>
        <Labeling>The platform will process the data in </Labeling>
      </Flex>
      <Labeling ml="15px">
        accordance with the instructions of the user. The user instructs the
        platform to: a) provide the services, including detection, prevention
        and resolution of security and technical issues, and b) respond to
        customers support requests. The platform will only process the data of
        the user in accordance with this agreement and will not process the data
        for any other purposes.
      </Labeling>

      <Flex mt="20px">
        <Labeling mr="5px">6.</Labeling>
        <Value mr="3px">Data minimization:</Value>
        <Labeling>The access to data within the platform is</Labeling>
      </Flex>
      <Labeling ml="15px">
        restricted in accordance to different roles established within the
        platform. The user may allocate different degrees of access the data
        depending on which role a person acting within the platform is being
        attributed. Other than the user, roles are attributed to the platform as
        an administrator and to ethics board or auditor who may monitor the
        processing conducted on the platform on behalf of the user or the
        platform.
      </Labeling>

      <Flex mt="20px">
        <Labeling mr="5px">7.</Labeling>
        <Value mr="3px">Retention periods:</Value>
        <Labeling>When uploading data to the platform, the </Labeling>
      </Flex>
      <Labeling ml="15px">
        user shall define a period of time under which the data is to be stored
        (retention period). The retention period should not be longer than
        necessary to conduct the storing and analyzing needed. If the user has
        not taken action to remove the data when the retention period has
        elapsed, the platform will contact the user and request that this is
        done. The user may prolong the retention period, but only if this is in
        accordance with applicable law. If the user does not either remove the
        data or prolong the retention period, the platform shall take action to
        remove the data from the platform. The user will be given due notice
        before any data is removed.
      </Labeling>

      <Flex mt="20px">
        <Labeling mr="5px">8.</Labeling>
        <Value mr="3px">Geographical limitations of processing the data:</Value>
        <Labeling>All processing </Labeling>
      </Flex>
      <Labeling ml="15px">
        of data within the platform will take place within the geographical area
        of EEA, namely the 28 Member States of the EU (Austria, Belgium,
        Bulgaria, Croatia, Cyprus, Czech Republic, Denmark, Estonia, Finland,
        France, Germany, Greece, Hungary, Ireland, Italy, Latvia, Lithuania,
        Luxembourg, Malta, Netherlands, Poland, Portugal, Romania, Slovakia,
        Slovenia, Spain, Sweden, United Kingdom) and Iceland, Liechtenstein and
        Norway.
      </Labeling>

      <Flex mt="20px">
        <Labeling mr="5px">9.</Labeling>
        <Value mr="3px">Data security:</Value>
        <Labeling>The platform ensures that the technical security</Labeling>
      </Flex>
      <Labeling ml="15px">
        measures and organizational measures governing the processing of the
        data within the platform is to be carried out in accordance to high
        safety standards. The platform ensures to keep the data of the user
        separated from all other users, within a secured space with limited
        access. The user is obligated to handle all security credentials with
        care and must not under any circumstances share them with others. The
        user and the platform are mutually obligated to immediately report any
        deviations from the proper functioning of the platform.
      </Labeling>

      <Flex mt="20px">
        <Labeling mr="3px">10.</Labeling>
        <Value mr="3px">Accountability:</Value>
        <Labeling>The user is to provide full contact information, </Labeling>
      </Flex>
      <Labeling ml="15px">
        including name of responsible person and his/her affiliation. The user
        agrees to keep the information updated. All processing of data within
        the cloud is to be recorded. The user and the platform are obligated to
        cooperate fully in order to ensure the fulfillment of this task. An
        audit organ, either internal or external, may access the recordings of
        the processing. Both the user and the platform may require a report from
        the audit organ to ensure that all processing of the data has been
        carried out in accordance with this agreement.
      </Labeling>

      <Flex mt="20px">
        <Labeling mr="3px">11.</Labeling>
        <Value mr="3px">Modification of the agreement:</Value>
        <Labeling>The platform may not </Labeling>
      </Flex>
      <Labeling ml="15px">
        unilaterally change or amend any of the terms of this agreement. All
        proposed changes to the agreement must be presented before the user in
        due time and cannot enter into force until accepted by the user. The
        platform is to inform the user of all changes in form of amendments,
        improvements and updates of the technical functioning of the platform.
        Any changes that may involve a change in the terms of this agreement
        must be accepted by the user before being implemented, as set out above.
      </Labeling>

      <Flex mt="20px">
        <Labeling mr="3px">12.</Labeling>
        <Value mr="3px">Termination of the services or agreement:</Value>
        <Labeling>The user may at </Labeling>
      </Flex>
      <Labeling ml="15px">
        any time remove his/her data from the platform. The user may terminate
        the agreement unilaterally at any time. The platform is to ensure that
        all data has been removed from the platform, including safety copies. If
        the user does not abide by his/her obligations under this agreement, the
        platform may unilaterally terminate the agreement. The user will be
        given notice of the platforms intention in due time. If the breach is
        not of a serious nature, the user may be given the opportunity to
        rectify the breach. Information on processing of data collected for
        auditing purposes will be stored within the platform for a reasonable
        time after the agreement has been terminated.
      </Labeling>
    </Flex>
    <Flex p="20px" bg="grayShade3" justifyContent="flex-end">
      <Button onClick={onClose} intent="secondary">
        Close
      </Button>
    </Flex>
  </Popup>
);

export default Terms;
