import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AppLogo from '../AppLogo/AppLogo';
import { Stack } from '@mui/material';

// ATUALIZE: Adicione Mensagens nas páginas (requireLogin: true)
const paginas = [
    {label:"Cadastrar Pet", href:"/register-pet", requireLogin:true},
    {label:"Buscar Pets", href:"/search-pets", requireLogin:false},
    {label:"Adoções Concluídas", href:"/success-stories", requireLogin:false},
    {label:"Mensagens", href:"/mensagens", requireLogin:true}, // NOVA PÁGINA
];

// ATUALIZE: Adicione Mensagens nas configurações do usuário
const configs = [
    {label:"Perfil", href:"/profile"},
    {label:"Mensagens", href:"/mensagens"}, // NOVO ITEM NO MENU DO USUÁRIO
    {label:"Sair", href:"/logout"},
];

export default function NavBar({isOpenModal, setOpenModal}) {
    const [anchorElNav, setAnchorElNav] = React.useState(null);
    const [anchorElUser, setAnchorElUser] = React.useState(null);

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const user = JSON.parse(localStorage.getItem("user"));

    return (
        <AppBar position="fixed">
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <IconButton
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{ display: { xs: 'none', md: 'inline-flex' } }}
                        component="a"
                        href="/"
                    >
                        <AppLogo />
                        <Typography variant='h5' sx={{ fontFamily: 'monospace', marginBottom: '-5px', marginLeft: '.25em' }}>MIAUDOTE</Typography>
                    </IconButton>

                    <Box sx={{ flexGrow: 0, display: { xs: 'flex', md: 'none' } }}>
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleOpenNavMenu}
                            color="inherit"
                        >
                            <MenuIcon />
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorElNav}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            open={Boolean(anchorElNav)}
                            onClose={handleCloseNavMenu}
                            sx={{ display: { xs: 'block', md: 'none' } }}
                        >
                            {paginas.map(({label, href, requireLogin}, index) => (
                                (requireLogin && !(user && user.logado)) ? <></> :
                                <MenuItem key={index} onClick={handleCloseNavMenu}>
                                    <Button
                                        sx={{ textAlign: 'center' }}
                                        component="a"
                                        size="small"
                                        href={href}
                                    >
                                        {label}
                                    </Button>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>

                    <IconButton
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        component="a"
                        href="/"
                        disableRipple
                        sx={{ display: { xs: 'flex', md: 'none' }, flexGrow: 1 }}
                    >
                        <AppLogo />
                        <Typography variant='h5' sx={{ fontFamily: 'monospace', marginBottom: '-5px', marginLeft: '.25em' }}>MIAUDOTE</Typography>
                    </IconButton>

                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                        {paginas.map(({label, href, requireLogin}, index) => (
                            (requireLogin && !(user && user.logado)) ? <></> :
                            <Button
                                key={index}
                                onClick={handleCloseNavMenu}
                                sx={{ my: 2, color: 'white', display: 'block', paddingTop: '12px' }}
                                component="a"
                                href={href}
                            >
                                {label}
                            </Button>
                        ))}
                    </Box>
                    <Box>
                        {
                            (user && user.logado) ? (
                                <Tooltip title="Usuário">
                                    <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                        <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
                                    </IconButton>
                                </Tooltip>
                            ) : (
                                <Stack direction="Row">
                                    <Button color="inherit" component="a" href='/cadastro-usuario'>Cadastrar</Button>
                                    <Button color="inherit" onClick={() => setOpenModal(!isOpenModal)}>Login</Button>
                                </Stack>
                            )
                        }

                        <Menu
                            sx={{ mt: '45px' }}
                            id="menu-appbar"
                            anchorEl={anchorElUser}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={Boolean(anchorElUser)}
                            onClose={handleCloseUserMenu}
                        >
                            {configs.map(({label, href}, index) => (
                                <MenuItem key={index} onClick={handleCloseUserMenu}>
                                    <Typography
                                        sx={{ textAlign: 'center', textDecoration: 'none' }}
                                        component="a"
                                        color='inherit'
                                        href={href}
                                    >
                                        {label}
                                    </Typography>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
}