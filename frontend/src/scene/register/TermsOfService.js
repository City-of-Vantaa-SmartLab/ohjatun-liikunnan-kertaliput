import React, { Component } from 'react';
import styled from 'react-emotion';
import Modal, {
    Title as ModalTitle,
    Content as ModalContent,
} from '../../components/modal';
import Button from '../../components/button';

const Overlay = styled(Modal)`
    width: 100%;
    height: 100%;
    padding: 4rem;
    z-index: 1000;
    position: absolute;
    top: 0;
    left: 0;
    background-color: white;
    justify-content: space-between;
`;
const Title = styled(ModalTitle)`
    font-size: 3rem;
    color: ${(props) => props.theme.main};
    text-transform: uppercase;
`;
const Content = styled(ModalContent)`
    align-self: flex-start;
    font-size: 2rem;
`;
const ActionSection = styled('div')`
    display: flex;
    align-self: flex-end;
`;

export default class TermsOfService extends Component {
    render() {
        return (
            <Overlay show={this.props.show} onClear={this.props.requestDismiss}>
                <div>
                    <Title>Käyttöehdot</Title>
                    <Content>
                        <h3>Tietoa palvelusta</h3>
                        <p>
                            Sovelluksessa voit ostaa kertamaksullisia paikkoja
                            Vantaan liikuntapalveluiden ohjatun liikunnan
                            tunneille. Kertamaksullisten paikkojen varaaminen
                            edellyttää saldoa, jota voit ladata palveluun
                            verkkopankki- tai luottokorttimaksulla. Huomioikaa,
                            että ladattua saldoa ei palauteta, eikä sitä voida
                            siirtää käyttäjältä toiselle. Saldoa kannattaa siis
                            ladata vain sen verran, kuin lähitulevaisuudessa
                            arvelee käyttävänsä.
                        </p>
                        <p>
                            Rekisteröitymällä sovelluksen käyttäjäksi, annat
                            suostumuksen Vantaan kaupungille käsitellä
                            syöttämiäsi tietojasi. Vantaan kaupunki sitoutuu
                            käsittelemään annettuja tietoja lainsäädännön ja
                            hyvän tietojenkäsittelytavan mukaisesti sekä
                            huolehtimaan tietojen riittävästä suojaamisesta.
                        </p>
                    </Content>
                </div>
                <ActionSection>
                    <Button
                        bold
                        onClick={this.props.requestDismiss}
                        onTouchStart={this.props.requestDismiss}
                    >
                        Takaisin
                    </Button>
                </ActionSection>
            </Overlay>
        );
    }
}
