import React from "react";
import './Footer.css';

function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer>
            <div className="footer-content">
                <p>&copy; {currentYear} Balancy. Todos os direitos reservados.</p>
                <div className="footer-links">
                    <a href="#about">Sobre</a>
                    <a href="#contact">Contato</a>
                    <a href="#terms">Termos de Uso</a>
                </div>
            </div>
        </footer>
    );
}

export default Footer;