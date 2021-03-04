package spotbugs.maliciouscode;

import java.util.List;

public class EiExposeRep {

    private String[] arrayVar;
    private List<String> listVar;

    public String[] getArrayVar() {
        return arrayVar;
    }

    public void setArrayVar(String[] arrayVar) {
        this.arrayVar = arrayVar;
    }

    public List<String> getListVar() {
        return listVar;
    }

    public void setListVar(List<String> listVar) {
        this.listVar = listVar;
    }
}
